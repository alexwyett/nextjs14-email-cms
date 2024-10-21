import { NextResponse } from "next/server";
import { matter } from "md-front-matter";
import { revalidatePath, revalidateTag } from "next/cache";
import { S3 } from "@cagen/ezsite-components";
import { SiteMKDown } from "@/lib/getPage";
import { slugify } from "@/lib/slugify";
import stripTags from "@/lib/stripTags";
import getExcerpt from "@/lib/getExcerpt";
import { removeAttachment, removeRecent, updateAttachments, updateRecent } from "@/lib/getRecent";
import deletePage from "@/lib/deletePage";

export async function POST(request: Request) {
  try {
    const { payload, attachments } = await request.json();

    const EDITORS = (process.env.EDITORS || '').split(',');

    if (!payload) {
      throw new Error('Payload is missing')
    }

    const { sender, subject } = payload;

    if (!sender || !EDITORS.find(e => e.toLowerCase() === sender.toLowerCase())) {
      throw new Error('Invalid editor')
    }

    console.log(payload, attachments)

    if (!subject) {
      throw new Error('Subject is missing')
    }

    if (!payload['body-plain']) {
      throw new Error('Subject is missing')
    }

    const sub = subject;
    const title = slugify(sub.split(':').pop());
    const contentPlain = stripTags(payload['body-plain'], '');
    const d = new Date();

    const DatePrefix = `${String(d.getFullYear())}/${String(d.getUTCMonth()).padStart(2, '0')}`;
    let Key = `${DatePrefix}/${title}`;

    const markdown = matter(contentPlain) as SiteMKDown;
    
    if (markdown?.data?.Key) {
      Key = markdown?.data?.Key;
    }

    console.log(contentPlain)

    // Invalidate caches
    revalidatePath(`/`);
    revalidatePath(`/${Key}`);
    revalidateTag(`recent.json`);
    revalidateTag(`attachments.json`);
    
    if (String(subject).startsWith('Delete:')) {
      await removeRecent(`${Key}/index.md`);
      await removeAttachment(`${Key}/index.md`);
      await deletePage(Key);
      return NextResponse.json({ 
        status: 'deleted',
        key: Key
      });
    }

    const thumbnail = (attachments || []).find((a: any) => a.filename.toLowerCase().endsWith('.png') || a.filename.toLowerCase().endsWith('.jpg') || a.filename.toLowerCase().endsWith('webp'));
    const otherAttachments = (attachments || []).filter((a: any) => a.filename.toLowerCase() !== thumbnail);
    const attached = otherAttachments.map((a: any) => a.filename);

    const data = [
      { key: 'Key', val: Key },
      { key: 'title', val: subject },
      { key: 'created', val: (new Date()).toISOString() },
      { key: 'description', val: markdown.data?.description || getExcerpt(markdown.content) },
      { key: 'thumbnail', val: thumbnail ? thumbnail.filename : undefined },
      { key: 'attachments', val: attached.length > 0 ? attached.join(',') : undefined }
    ].filter(c => c.val);

    console.log(data, contentPlain, Key)

    await S3.UploadFile(
      `${Key}/index.md`,
      `${data.length > 0 ? `---\r\n` : ''}${data.map(c => `${c.key}: ${c.val}`).join('\r\n')}${data.length > 0 ? `\r\n---\r\n` : ''}${markdown.content}`,
      'text/plain',
      'utf-8'
    );

    // Update recent
    if (!markdown?.data?.Key) {
      await updateRecent([`${Key}/index.md`]);
    }

    // Upload attachments
    const filenames = await Promise.all(
      otherAttachments.map(
        async (a: any) => {
          try {
            return await S3.DownloadUploadFile(a.url, a.filename, Key)
          } catch (e: any) {
            console.log(e);
            return '';
          }
        }
      )
    )

    if (filenames.filter(f => f).length > 0) {
      await updateAttachments([`${Key}/index.md`]);
    }

    return NextResponse.json({ 
      status: 'ok',
      key: Key
    });
  } catch(e: any) {
    console.error(e?.message || 'An error occured')
    return NextResponse.json({ message: e?.message || 'An error occured' }, { status: 400 })
  }
}