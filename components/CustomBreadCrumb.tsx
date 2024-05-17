import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import Link from "next/link";

const CustomBreadCrumb = ({
  links,
}: {
  links: { title: string; href: string }[];
}) => {
  return (
    <Breadcrumb className="mb-16">
      <BreadcrumbList>
        {links.map((link, ind) => (
          <div key={ind} className="flex items-center gap-4">
            <BreadcrumbItem>
              {ind < links.length - 1 ? (
                <BreadcrumbLink asChild>
                  <Link href={link.href}>{link.title}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{link.title}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {ind != links.length-1 && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CustomBreadCrumb;
