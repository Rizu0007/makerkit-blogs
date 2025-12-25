import Link from 'next/link';
import { Button } from '@kit/ui/button';
import { Card, CardContent } from '@kit/ui/card';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardContent className="p-12 text-center space-y-4">
          <h2 className="text-2xl font-bold">Post Not Found</h2>
          <p className="text-muted-foreground">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/">
            <Button>Back to Blog</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
