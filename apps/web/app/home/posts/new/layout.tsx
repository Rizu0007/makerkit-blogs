export default function CreatePostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout removes the sidebar and provides a clean, full-width experience
  return <>{children}</>;
}
