import React from "react";
import SEO from "../components/SEO";
import SeriesList from "../components/series/SeriesList";

export default function SeriesPage() {
	return <SeriesList lang="ko" />;
}

export function Head() {
	return <SEO title="Series" />;
}
