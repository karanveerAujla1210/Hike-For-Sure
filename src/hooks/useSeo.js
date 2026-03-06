import { useEffect } from "react";

const DEFAULT_TITLE = "Hike For Sure";
const DEFAULT_DESCRIPTION =
  "Hike For Sure is a modern recruitment consultancy platform for candidates and employers.";

const upsertMeta = (selector, attribute, value) => {
  let tag = document.querySelector(selector);
  if (!tag) {
    tag = document.createElement("meta");
    const [attrName, attrValue] = attribute.split("=");
    tag.setAttribute(attrName, attrValue.replaceAll('"', ""));
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", value);
};

export const useSeo = ({ title, description }) => {
  useEffect(() => {
    const pageTitle = title ? `${title} | Hike For Sure` : DEFAULT_TITLE;
    const pageDescription = description || DEFAULT_DESCRIPTION;

    document.title = pageTitle;
    upsertMeta('meta[name="description"]', 'name="description"', pageDescription);
    upsertMeta('meta[property="og:title"]', 'property="og:title"', pageTitle);
    upsertMeta(
      'meta[property="og:description"]',
      'property="og:description"',
      pageDescription
    );
  }, [title, description]);
};
