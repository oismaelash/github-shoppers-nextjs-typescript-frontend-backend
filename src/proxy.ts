import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

const publicPages = ["/", "/auth/signin", "/marketplace"];

type NextMiddlewareHandler = (req: NextRequest) => NextResponse | Promise<NextResponse>;

const authMiddleware: NextMiddlewareHandler = withAuth(
  function onSuccess() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => token != null,
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
) as unknown as NextMiddlewareHandler;

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/") {
    return NextResponse.next();
  }

  const isPublicPage = publicPages.includes(pathname);

  if (isPublicPage) {
    return NextResponse.next();
  }

  return authMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
