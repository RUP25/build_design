"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  bestSellerProjects,
  collectionSortOptions,
  type CollectionProject,
  type CollectionSort,
} from "@/lib/content";

function CollectionCard({ project }: { project: CollectionProject }) {
  return (
    <article className="group">
      <Link href="/#contact" className="block">
        <div className="relative mb-4 aspect-square overflow-hidden bg-[#ece7df]">
          <Image
            src={project.image}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>

        <h2 className="text-center font-serif text-base leading-snug text-charcoal sm:text-[1.05rem]">
          {project.name}
        </h2>
        <p className="mt-1 text-center text-sm text-warm-gray">
          {project.category} · {project.location}
        </p>
      </Link>
    </article>
  );
}

export function BestSellersCollection() {
  const [sort, setSort] = useState<CollectionSort>("featured");

  const sortedProjects = useMemo(() => {
    const items = [...bestSellerProjects];

    switch (sort) {
      case "name-asc":
        items.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        items.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "category":
        items.sort((a, b) => a.category.localeCompare(b.category));
        break;
      default:
        items.sort((a, b) => Number(b.featured) - Number(a.featured));
        break;
    }

    return items;
  }, [sort]);

  return (
    <>
      <div className="bg-design py-2.5 text-center text-xs tracking-wide text-cream sm:text-sm">
        Signature residential and commercial projects — curated featured work
      </div>

      <section className="bg-cream pb-16 pt-6 sm:pb-20 sm:pt-8 lg:pb-24">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-10">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 text-sm text-warm-gray sm:mb-10"
          >
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="transition-colors hover:text-charcoal">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-charcoal">Best Sellers</li>
            </ol>
          </nav>

          <h1 className="heading-display mb-10 text-center text-3xl text-charcoal sm:mb-12 sm:text-4xl lg:text-[2.75rem]">
            Best Sellers ({sortedProjects.length})
          </h1>

          <div className="mb-8 flex justify-end sm:mb-10">
            <label className="relative inline-flex min-w-[11rem] items-center">
              <span className="sr-only">Sort by</span>
              <select
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value as CollectionSort)
                }
                className="w-full appearance-none border border-charcoal/15 bg-white py-2.5 pr-10 pl-4 text-sm text-charcoal outline-none"
              >
                {collectionSortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-3 text-xs text-warm-gray"
              >
                ▾
              </span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 sm:gap-y-12 md:grid-cols-3 lg:grid-cols-4">
            {sortedProjects.map((project) => (
              <CollectionCard key={project.name} project={project} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
