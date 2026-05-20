// 2026-05-20 — Friend-test pass 6 (Tyler, David, Sarah all hit
// /cabin/album expecting to land on the voyage album page. Redirect
// to the real slug rather than 404'ing into the marketing site).
import { redirect } from "next/navigation";

export default function CabinAlbumAlias() {
  redirect("/cabin/voyage-album");
}
