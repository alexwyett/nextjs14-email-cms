import { Metadata } from "next";
import { BASE_URL } from "@/constants";

export default function getStaticMetadata(prefix?: string, description?: string): Metadata {
  return {
    metadataBase: new URL(BASE_URL),
    title: `${prefix ? `${prefix} | ` : ''}`,
    ...(description ? { description: description.replaceAll("&nbsp;", "").replace(/(<([^>]+)>)/gi, "").split('.')[0].slice(0, 150) } : { description: '' })
  }
}