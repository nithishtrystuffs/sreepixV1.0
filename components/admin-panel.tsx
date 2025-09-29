"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Plus, Save, X } from "lucide-react"
import { GoogleCalendarSetup } from "@/components/google-calendar-setup"
import type { ServiceItem } from "@/lib/types"

interface AdminPanelProps {
  services: ServiceItem[]
  onServicesUpdate: (services: ServiceItem[]) => void
  onBack: () => void
}

export function AdminPanel({ services, onServicesUpdate, onBack }: AdminPanelProps) {
  const [editingService, setEditingService] = useState<ServiceItem | null>(null)
  const [newService, setNewService] = useState<Partial<ServiceItem>>({
    description: "",
    category: "urudhi",
    unit: "",
    rate: 0,
    defaultQty: 1,
  })
  const [isUpdating, setIsUpdating] = useState(false)

  const updateServicesAndPersist = async (updatedServices: ServiceItem[]) => {
    setIsUpdating(true)
    try {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedServices),
      })

      if (!response.ok) {
        throw new Error("Failed to update services")
      }

      // Update local state only after successful API call
      onServicesUpdate(updatedServices)
    } catch (error) {
      console.error("Error updating services:", error)
      alert("Failed to update services. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAddService = async () => {
    if (!newService.description || !newService.unit || !newService.rate) {
      alert("Please fill in all required fields")
      return
    }

    const service: ServiceItem = {
      id: Date.now().toString(),
      description: newService.description!,
      category: newService.category as ServiceItem["category"],
      unit: newService.unit!,
      rate: newService.rate!,
      defaultQty: newService.defaultQty,
    }

    await updateServicesAndPersist([...services, service])

    if (!isUpdating) {
      setNewService({
        description: "",
        category: "urudhi",
        unit: "",
        rate: 0,
        defaultQty: 1,
      })
    }
  }

  const handleEditService = (service: ServiceItem) => {
    setEditingService({ ...service })
  }

  const handleSaveEdit = async () => {
    if (!editingService) return

    const updatedServices = services.map((service) => (service.id === editingService.id ? editingService : service))
    await updateServicesAndPersist(updatedServices)

    if (!isUpdating) {
      setEditingService(null)
    }
  }

  const handleDeleteService = async (serviceId: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      const updatedServices = services.filter((service) => service.id !== serviceId)
      await updateServicesAndPersist(updatedServices)
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "urudhi":
        return "Urudhi"
      case "ennai_seer_reception_wedding":
        return "Ennai Seer, Reception & Wedding"
      case "post_wedding":
        return "Post Wedding"
      default:
        return category
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "urudhi":
        return "bg-blue-100 text-blue-800"
      case "ennai_seer_reception_wedding":
        return "bg-purple-100 text-purple-800"
      case "post_wedding":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Manage your photography services</p>
        </div>
        <Button onClick={onBack} variant="outline">
          Back to Services
        </Button>
      </div>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList>
          <TabsTrigger value="services">Manage Services</TabsTrigger>
          <TabsTrigger value="add">Add New Service</TabsTrigger>
          <TabsTrigger value="calendar">Calendar Setup</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <GoogleCalendarSetup />
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Services ({services.length})</CardTitle>
              <CardDescription>View and manage all photography services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50"
                  >
                    {editingService?.id === service.id ? (
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                              id="edit-description"
                              value={editingService.description}
                              onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-category">Category</Label>
                            <Select
                              value={editingService.category}
                              onValueChange={(value) =>
                                setEditingService({
                                  ...editingService,
                                  category: value as ServiceItem["category"],
                                })
                              }
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="urudhi">Urudhi</SelectItem>
                                <SelectItem value="ennai_seer_reception_wedding">
                                  Ennai Seer, Reception & Wedding
                                </SelectItem>
                                <SelectItem value="post_wedding">Post Wedding</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="edit-unit">Unit</Label>
                            <Input
                              id="edit-unit"
                              value={editingService.unit}
                              onChange={(e) => setEditingService({ ...editingService, unit: e.target.value })}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-rate">Rate (₹)</Label>
                            <Input
                              id="edit-rate"
                              type="number"
                              value={editingService.rate}
                              onChange={(e) =>
                                setEditingService({ ...editingService, rate: Number.parseInt(e.target.value) || 0 })
                              }
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleSaveEdit} size="sm" disabled={isUpdating}>
                            <Save className="w-4 h-4 mr-2" />
                            {isUpdating ? "Saving..." : "Save"}
                          </Button>
                          <Button onClick={() => setEditingService(null)} variant="outline" size="sm">
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getCategoryColor(service.category)}>
                              {getCategoryLabel(service.category)}
                            </Badge>
                            <span className="text-sm text-muted-foreground">#{service.id}</span>
                          </div>
                          <p className="font-medium">{service.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Unit: {service.unit}</span>
                            <span>Rate: ₹{service.rate.toLocaleString()}</span>
                            {service.defaultQty && <span>Default Qty: {service.defaultQty}</span>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => handleEditService(service)} variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteService(service.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Service</CardTitle>
              <CardDescription>Create a new photography service offering</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="description">Service Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter detailed service description..."
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={newService.category}
                    onValueChange={(value) =>
                      setNewService({ ...newService, category: value as ServiceItem["category"] })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urudhi">Urudhi</SelectItem>
                      <SelectItem value="ennai_seer_reception_wedding">Ennai Seer, Reception & Wedding</SelectItem>
                      <SelectItem value="post_wedding">Post Wedding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="unit">Unit *</Label>
                  <Input
                    id="unit"
                    placeholder="e.g., 1 Camera, 30 Sheets"
                    value={newService.unit}
                    onChange={(e) => setNewService({ ...newService, unit: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="rate">Rate (₹) *</Label>
                  <Input
                    id="rate"
                    type="number"
                    placeholder="0"
                    value={newService.rate || ""}
                    onChange={(e) => setNewService({ ...newService, rate: Number.parseInt(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="defaultQty">Default Quantity</Label>
                  <Input
                    id="defaultQty"
                    type="number"
                    placeholder="1"
                    value={newService.defaultQty || ""}
                    onChange={(e) => setNewService({ ...newService, defaultQty: Number.parseInt(e.target.value) || 1 })}
                    className="mt-1"
                  />
                </div>
              </div>
              <Button onClick={handleAddService} className="w-full" disabled={isUpdating}>
                <Plus className="w-4 h-4 mr-2" />
                {isUpdating ? "Adding Service..." : "Add Service"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
