import React, { useMemo } from "react";
import { PageProps } from "gatsby";
import SEO from "../../components/SEO";
import PostList from "../../components/post/PostList";

export default function HomePage({ location }: PageProps) {
	const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
	const category = useMemo(() => params.get("category"), [params]);

	return <PostList lang="en" category={category} />;
}

export function Head() {
	return <SEO title="Home" />;
}
