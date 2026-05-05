import { WgerPaginatedResponse } from "../../wger/types.js";
import {
  GalleryImage,
  ImageRequest,
  PatchedImageRequest,
} from "../../../domain/models/Routine.types.js";
import { EndpointDescriptor } from "../EndpointDescriptor.js";
import { paginatedResponseSchema, galleryImageResponseSchema } from "../responseSchemas.js";

export const listGalleryImagesEndpoint: EndpointDescriptor<
  { limit?: number | undefined; offset?: number | undefined },
  WgerPaginatedResponse<GalleryImage>
> = {
  method: "GET",
  path: "/api/v2/gallery/",
  mapParams: (args) => ({ limit: args.limit, offset: args.offset }),
  responseSchema: paginatedResponseSchema(galleryImageResponseSchema),
};

export const getGalleryImageEndpoint: EndpointDescriptor<
  { id: number },
  GalleryImage
> = {
  method: "GET",
  path: (args) => `/api/v2/gallery/${args.id}/`,
  responseSchema: galleryImageResponseSchema,
};

export const createGalleryImageEndpoint: EndpointDescriptor<
  { date: string; image: string; description?: string | undefined },
  GalleryImage,
  ImageRequest
> = {
  method: "POST",
  path: "/api/v2/gallery/",
  mapBody: (args) => args as ImageRequest,
  responseSchema: galleryImageResponseSchema,
};

export const updateGalleryImageEndpoint: EndpointDescriptor<
  { id: number; date?: string | undefined; image?: string | undefined; description?: string | undefined },
  GalleryImage,
  PatchedImageRequest
> = {
  method: "PATCH",
  path: (args) => `/api/v2/gallery/${args.id}/`,
  mapBody: ({ id: _id, ...body }) => body as PatchedImageRequest,
  responseSchema: galleryImageResponseSchema,
};
