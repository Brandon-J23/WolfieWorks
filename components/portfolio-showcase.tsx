"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ExternalLink, ImageIcon } from "lucide-react"

// Types for portfolio items
type PortfolioItem = {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  file_url?: string // Changed from imageUrl
  project_url?: string
  featured: boolean
  createdAt: Date
}

type PortfolioShowcaseProps = {
  portfolioItems: PortfolioItem[]
  showFeaturedOnly?: boolean
  compact?: boolean
}

export function PortfolioShowcase({
  portfolioItems,
  showFeaturedOnly = false,
  compact = false,
}: PortfolioShowcaseProps) {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Filter items if showFeaturedOnly is true
  const displayedItems = showFeaturedOnly ? portfolioItems.filter((item) => item.featured) : portfolioItems

  // Get unique categories from items
  const uniqueCategories = Array.from(new Set(displayedItems.map((item) => item.category)))

  // Find category label
  const getCategoryLabel = (value: string) => {
    return categories.find((c) => c.value === value)?.label || value
  }

  // Handle item click to show details
  const handleItemClick = (item: PortfolioItem) => {
    setSelectedItem(item)
    setIsDialogOpen(true)
  }

  return (
    <div className="w-full">
      {displayedItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No portfolio items</h3>
          <p className="text-gray-500 mt-1">
            {showFeaturedOnly
              ? "No featured projects have been added yet."
              : "No projects have been added to the portfolio yet."}
          </p>
        </div>
      ) : (
        <>
          {!compact && uniqueCategories.length > 1 ? (
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="bg-gray-100">
                <TabsTrigger value="all">All Projects</TabsTrigger>
                {uniqueCategories.map((category) => (
                  <TabsTrigger key={category} value={category} className="hidden md:inline-flex">
                    {getCategoryLabel(category)}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="all">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedItems.map((item) => (
                    <PortfolioCard key={item.id} item={item} onClick={() => handleItemClick(item)} />
                  ))}
                </div>
              </TabsContent>

              {uniqueCategories.map((category) => (
                <TabsContent key={category} value={category}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedItems
                      .filter((item) => item.category === category)
                      .map((item) => (
                        <PortfolioCard key={item.id} item={item} onClick={() => handleItemClick(item)} />
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedItems.map((item) => (
                <PortfolioCard key={item.id} item={item} onClick={() => handleItemClick(item)} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Portfolio Item Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedItem && (
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedItem.title}</DialogTitle>
              <DialogDescription>
                {getCategoryLabel(selectedItem.category)} • {selectedItem.createdAt.toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedItem.file_url && (
                <div className="w-full aspect-video bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={selectedItem.file_url || "/placeholder.svg"} // Changed from imageUrl
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{selectedItem.description}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-red-50 text-red-700">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedItem.project_url && (
                <div className="pt-4">
                  <Button asChild className="bg-red-600 hover:bg-red-700">
                    <a href={selectedItem.project_url} target="_blank" rel="noopener noreferrer">

                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Project
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

// Portfolio Card Component for public view
function PortfolioCard({ item, onClick }: { item: PortfolioItem; onClick: () => void }) {
  const categoryLabel = categories.find((c) => c.value === item.category)?.label || item.category

  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <div className="aspect-video bg-gray-200 relative">
        {item.file_url ? ( // Changed from item.imageUrl
          <img src={item.file_url || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" /> // Changed from item.imageUrl
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
        {item.featured && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-red-600 text-white">Featured</Badge>
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{item.title}</CardTitle>
        <CardDescription>{categoryLabel}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-gray-700 line-clamp-2">{item.description}</p>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {item.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{item.tags.length - 3} more
            </Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

// Categories for portfolio items
const categories = [
  { value: "web-development", label: "Web Development" },
  { value: "mobile-development", label: "Mobile Development" },
  { value: "design", label: "Design & UI/UX" },
  { value: "writing", label: "Writing & Content" },
  { value: "data-science", label: "Data Science & Analysis" },
  { value: "marketing", label: "Marketing" },
  { value: "video", label: "Video & Animation" },
  { value: "other", label: "Other" },

]
