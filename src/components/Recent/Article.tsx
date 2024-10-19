"use client";

import classNames from "classnames";
import Link from "next/link";
import { S3_BASE_URL } from "@/constants";
import { SiteMKDown } from "@/lib/getPage";
import Button from "../Button";

export default function Article({ data: { title, thumbnail, description }, excerpt, href }: SiteMKDown) {
  return (
    <article
      className="bg-white rounded-sm p-4 relative flex flex-col gap-4" 
    >
      <Link href={`/${href}`} className="absolute w-full h-full top-0 left-0"></Link>
      <figure 
        className={
          classNames(
            "bg-nbadark flex justify-center items-center min-h-32 aspect-square overflow-hidden",
            {
              'p-4': typeof thumbnail === 'undefined'
            }
          )
        }>
        <img 
          src={thumbnail ? `${S3_BASE_URL}${href}/${thumbnail}` : '/transparent.png'} 
          className={
            classNames(
              "object-cover h-full w-full"
            )
          }
        />
      </figure>
      <h2 className="p-0 m-0 uppercase font-bold text-nbadark">{title}</h2>
      <p className="line-clamp-3 mb-16">{description || excerpt}</p>
      <Button className="absolute right-4 bottom-4">Read More</Button>
    </article>
  )
}