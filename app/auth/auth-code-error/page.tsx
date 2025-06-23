import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, AlertCircle } from "lucide-react"

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-red-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-3">
            <GraduationCap className="h-8 w-8" />
            <h1 className="text-2xl font-bold">WolfieWorks</h1>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Authentication Error</CardTitle>
              <CardDescription className="text-gray-600">
                There was an error signing you in. Please try again.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/sign-in">
                <Button className="w-full bg-red-600 hover:bg-red-700">Try Again</Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Go Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
