// --- Enum برای نوع دسترسی به کتاب
export enum EbookAccess {
  Borrowable = "borrowable",
  NoEbook = "no_ebook",
  Printdisabled = "printdisabled",
  Public = "public",
  Unclassified = "unclassified",
}

// --- ریسپانس جستجو (search.json)
export interface SearchResponse {
  numFound:          number;
  start:             number;
  numFoundExact:     boolean;
  num_found:         number;
  documentation_url: string;
  q:                 string;
  offset:            null;
  docs:              Doc[];
}

export interface Doc {
  author_key:            string[];
  author_name:           string[];
  cover_edition_key?:    string;
  cover_i?:              number;
  ebook_access:          EbookAccess;
  edition_count:         number;
  first_publish_year:    number;
  has_fulltext:          boolean;
  ia?:                   string[];
  ia_collection_s?:      string;
  key:                   string;
  language:              string[];
  lending_edition_s?:    string;
  lending_identifier_s?: string;
  public_scan_b:         boolean;
  title:                 string;
  id_standard_ebooks?:   string[];
  id_librivox?:          string[];
  id_project_gutenberg?: string[];
  id_wikisource?:        string[];
  subtitle?:             string;
  subject?:              string[]; // 🔹 اضافه برای استفاده در استور
}

// --- ریسپانس دسته‌بندی (subjects/{category}.json)
export interface SubjectResponse {
  key:          string;
  name:         string;
  subject_type: string;
  work_count:   number;
  works:        Work[];
}

export interface Work {
  key:      string;
  title:    string;
  cover_id?: number;
  rating?:  number;
}
export interface Product {
  id: string
  title: string
  price: number
  image: string
  rating?: number
  category: string
    originalId?: string // اضافه برای نگه داشتن id اصلی openlibrary
     openLibraryId?: string 

}
