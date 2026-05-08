export default function SeoJsonLd() {
  const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Kohinoor Restaurant & Cozy Rooms",
    "image": [
      "https://kohinoorrestaurant.com/favicon.jpg",
      "https://kohinoorrestaurant.com/exterior%20entry.jpg",
      "https://kohinoorrestaurant.com/sekuwa.jpg"
    ],
    "@id": "https://kohinoorrestaurant.com",
    "url": "https://kohinoorrestaurant.com",
    "telephone": "+9779715233533",
    "priceRange": "Rs 500 - Rs 5000",
    "menu": "https://kohinoorrestaurant.com/#menu",
    "servesCuisine": ["Nepali", "Chicken Sekuwa", "Buff Sekuwa", "Pork Sekuwa", "Local Nepalese Cuisine"],
    "acceptsReservations": "true",
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Private Cabins",
        "value": "true"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Lakeside View",
        "value": "true"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Boating",
        "value": "true"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Free WiFi",
        "value": "true"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Tilottama-13, Kotihawa",
      "addressLocality": "Bhairahawa",
      "addressRegion": "Lumbini",
      "postalCode": "32900",
      "addressCountry": "NP"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 27.6828,
      "longitude": 83.4551
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
      ],
      "opens": "10:00",
      "closes": "22:00"
    },
    "sameAs": [
      "https://www.facebook.com/people/Kohinoor-Restaurant/61570447280338/",
      "https://www.instagram.com/kohinoor_restaurant2024",
      "https://www.tiktok.com/@kohinoor.restaurant"
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the price of a room at Kohinoor Restaurant?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The cheapest cozy rooms at Kohinoor Restaurant start at just Rs 500, making it the most affordable stay in Bhairahawa and Butwal."
        }
      },
      {
        "@type": "Question",
        "name": "Does Kohinoor Restaurant have private cabins for couples?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Kohinoor Restaurant offers romantic private cabins with complimentary access, perfect for couples and private birthday celebrations in Kotihawa."
        }
      },
      {
        "@type": "Question",
        "name": "What are the specialties at Kohinoor Restaurant?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We are famous for our Sekuwa corner, serving authentic Chicken, Buff, and Pork Sekuwa. We also offer lakeside dining with boating facilities."
        }
      },
      {
        "@type": "Question",
        "name": "Where is Kohinoor Restaurant located?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Kohinoor Restaurant is located in Tilottama-13, Kotihawa, near the sacred site of Lumbini, serving guests from Bhairahawa and Butwal."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://kohinoorrestaurant.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Menu",
        "item": "https://kohinoorrestaurant.com/#menu"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "About",
        "item": "https://kohinoorrestaurant.com/#about"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
