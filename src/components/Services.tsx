"use client";

import { services } from "@/lib/content";
import { Beliefs } from "@/components/Beliefs";
import { ServicesHero } from "./services/ServicesHero";
import { ServicesIntro } from "./services/ServicesIntro";
import { ServicesSolutionsScroll } from "./services/ServicesSolutionsScroll";
import { ServicesCta } from "./services/ServicesProcessSection";

export function Services() {
  return (
    <>
      <ServicesHero />
      <ServicesIntro />
      <ServicesSolutionsScroll services={services} />
      <Beliefs />
      <ServicesCta />
    </>
  );
}
