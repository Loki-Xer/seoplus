export interface SEOState {
  title?: string;
  description?: string;
  keywords?: string | string[];
  author?: string;
  robots?: string;
  canonical?: string;

  meta?: Record<string, string>;
  og?: Record<string, string>;
  twitter?: Record<string, string>;
}

type SEOEntry = {
  id: number;
  data: SEOState;
};

class SEOManager {
  private state: SEOState = {};

  private entries: SEOEntry[] = [];

  private currentId = 0;

  register(data: SEOState) {
    let entry = {
      id: ++this.currentId,
      data
    };

    this.entries.push(entry);

    this.recompute();

    return entry.id;
  }

  update(id: number, data: SEOState) {
    let entry = this.entries.find(
      entry => entry.id === id
    );

    if (!entry) return;

    entry.data = data;

    this.recompute();
  }

  unregister(id: number) {
    this.entries = this.entries.filter(
      entry => entry.id !== id
    );

    this.recompute();
  }

  private recompute() {
    let merged: SEOState = {};

    for (let entry of this.entries) {
      merged = {
        ...merged,
        ...entry.data
      };
    }

    this.state = merged;

    this.flush();
  }

  set(data: Partial<SEOState>) {
    this.state = {
      ...this.state,
      ...data
    };

    this.flush();
  }

  get() {
    return this.state;
  }

  reset() {
    this.state = {};

    this.entries = [];

    this.flush();
  }

  private setMeta(name: string, content: string) {
    let tag = document.querySelector(
      `meta[name="${name}"]`
    ) as HTMLMetaElement | null;

    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", name);
      document.head.appendChild(tag);
    }

    tag.setAttribute("content", content);
  }

  private setProperty(
    property: string,
    content: string
  ) {
    let tag = document.querySelector(
      `meta[property="${property}"]`
    ) as HTMLMetaElement | null;

    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("property", property);
      document.head.appendChild(tag);
    }

    tag.setAttribute("content", content);
  }

  private setCanonical(url: string) {
    let tag = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;

    if (!tag) {
      tag = document.createElement("link");
      tag.rel = "canonical";
      document.head.appendChild(tag);
    }

    tag.href = url;
  }

  flush() {
    if (typeof document === "undefined") {
      return;
    }

    let state = this.state;

    if (state.title) {
      document.title = state.title;
    }

    if (state.description) {
      this.setMeta(
        "description",
        state.description
      );
    }

    if (state.keywords) {
      this.setMeta(
        "keywords",
        Array.isArray(state.keywords)
          ? state.keywords.join(", ")
          : state.keywords
      );
    }

    if (state.author) {
      this.setMeta(
        "author",
        state.author
      );
    }

    if (state.robots) {
      this.setMeta(
        "robots",
        state.robots
      );
    }

    if (state.canonical) {
      this.setCanonical(
        state.canonical
      );
    }

    if (state.meta) {
      Object.entries(state.meta).forEach(
        ([key, value]) => {
          this.setMeta(key, value);
        }
      );
    }

    if (state.og) {
      Object.entries(state.og).forEach(
        ([key, value]) => {
          this.setProperty(
            `og:${key}`,
            value
          );
        }
      );
    }

    if (state.twitter) {
      Object.entries(state.twitter).forEach(
        ([key, value]) => {
          this.setMeta(
            `twitter:${key}`,
            value
          );
        }
      );
    }
  }
}

export default new SEOManager();