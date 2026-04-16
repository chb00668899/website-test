import MetaTags from './MetaTags';

type SEOProps = {
  title: string;
  description?: string;
  keywords?: string;
  author?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  canonical?: string;
};

export const SEO = ({
  title,
  description,
  keywords,
  author,
  ogTitle,
  ogDescription,
  ogImage,
  ogType,
  twitterCard,
  canonical,
}: SEOProps) => {
  return (
    <MetaTags
      title={title}
      description={description}
      keywords={keywords}
      author={author}
      ogTitle={ogTitle}
      ogDescription={ogDescription}
      ogImage={ogImage}
      ogType={ogType}
      twitterCard={twitterCard}
      canonical={canonical}
    />
  );
};

export default SEO;
