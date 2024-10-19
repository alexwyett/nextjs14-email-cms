import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import getPage, { SiteMKDown } from '@/lib/getPage';
import getStaticMetadata from '@/lib/getStaticMetadata';
import Layout from '@/components/Layout';
import markdown from '@wcj/markdown-to-html';
import Attachment from '@/components/Attachment';
import CopyText from '@/components/CopyText';
import { S3_BASE_URL } from '@/constants';

async function getPageBySlug(slug: string|string[]): Promise<SiteMKDown> {
  try {
    return await getPage(slug)
  } catch (e: any) {
    console.log(e);
    return notFound();
  }
}

export async function generateMetadata({ params }: { params: { slug: string|string[]} }): Promise<Metadata> {
  const data = await getPageBySlug(params.slug);
  if (!data) {
		return notFound()
  }
  
  return getStaticMetadata(data.data.title, data.data.description || data.content);
}

export default async function Page({ params }: { params: { slug: string } }) {
  if (!params.slug) {
		return notFound()
  }

  const page = await getPageBySlug(params.slug);
  
  return (
    <div className='flex flex-col gap-4 md:flex-row items-start'>
      <Layout className='grow flex flex-col gap-4 !p-0'>
        <div className='bg-white flex flex-col gap-4 p-4'>
          <h1 className='uppercase font-bold text-xl text-blue-900'>{page.data.title}</h1>
          {page.data?.thumbnail && !page.content.includes('![') && <img src={`${S3_BASE_URL}${page.href}/${page.data.thumbnail}`} alt={page.data.title} />}
          <article className='content' dangerouslySetInnerHTML={{ __html: markdown(page.content) }} />
          <span className="block italic text-xs ml-auto mr-0">Page created: {page.data.created.toLocaleDateString()}</span>
        </div>
        {page.files.length > 0 && <div className='bg-white flex flex-col gap-4'>
          <ul className='flex flex-col gap-4 p-4'>
            {page.files.map((f, i) => <Attachment key={i} {...f} />)}
          </ul>
        </div>}
        <div className="ml-auto mr-0 print:hidden">
          <CopyText text={page.raw} />
        </div>
      </Layout>
    </div>
  );
}

export const revalidate = 60;