import { useEffect, useState } from "react";
import { fallbackContent } from "../contentFallback";
import { siteApi } from "../services/api";

export const useSiteContent = () => {
  const [content, setContent] = useState(fallbackContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [source, setSource] = useState("fallback");

  const refresh = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await siteApi.getPublicContent();
      setContent(data);
      setSource("api");
    } catch (requestError) {
      setContent(fallbackContent);
      setSource("fallback");
      setError(requestError.message || "Preview content loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return {
    content,
    loading,
    error,
    source,
    refresh
  };
};
