import { PageFile } from "@/lib/s3";

export default function Attachment(file: PageFile) {
  return (
    <li>
      <a href={file.url} target="_blank">
        {file.filename}
        {file.last_modified && <span className="block italic text-xs">Last modified: {file.last_modified.toLocaleDateString()}</span>}
      </a>
    </li>
  )
}