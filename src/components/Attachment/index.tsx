import { S3 } from "@cagen/ezsite-components";
import { S3_BASE_URL } from "@/constants";

export default function Attachment(file: S3.PageFile) {
  return (
    <li>
      <a href={`${S3_BASE_URL}${file.Key}`} target="_blank">
        {file.filename}
        {file.last_modified && <span className="block italic text-xs">Last modified: {file.last_modified.toLocaleDateString()}</span>}
      </a>
    </li>
  )
}