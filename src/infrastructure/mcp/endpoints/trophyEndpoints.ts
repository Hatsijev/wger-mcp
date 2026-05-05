import { WgerPaginatedResponse } from "../../wger/types.js";
import {
  Trophy,
  TrophyProgress,
  UserTrophy,
  UserStatistics,
} from "../../../domain/models/Reference.types.js";
import { EndpointDescriptor } from "../EndpointDescriptor.js";
import {
  paginatedResponseSchema,
  trophyResponseSchema,
  trophyProgressResponseSchema,
  userTrophyResponseSchema,
  userStatisticsResponseSchema,
} from "../responseSchemas.js";

export const listTrophiesEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    ordering?: string | undefined;
    id?: number | undefined;
    id__in?: string | undefined;
    is_active?: boolean | undefined;
    is_hidden?: boolean | undefined;
    is_progressive?: boolean | undefined;
    is_repeatable?: boolean | undefined;
    trophy_type?: string | undefined;
    trophy_type__in?: string | undefined;
  },
  WgerPaginatedResponse<Trophy>
> = {
  method: "GET",
  path: "/api/v2/trophy/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    ordering: args.ordering,
    id: args.id,
    id__in: args.id__in,
    is_active: args.is_active,
    is_hidden: args.is_hidden,
    is_progressive: args.is_progressive,
    is_repeatable: args.is_repeatable,
    trophy_type: args.trophy_type,
    trophy_type__in: args.trophy_type__in,
  }),
  responseSchema: paginatedResponseSchema(trophyResponseSchema),
};

export const getTrophyEndpoint: EndpointDescriptor<{ id: number }, Trophy> = {
  method: "GET",
  path: (args) => `/api/v2/trophy/${args.id}/`,
  responseSchema: trophyResponseSchema,
};

export const listTrophyProgressEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    ordering?: string | undefined;
  },
  WgerPaginatedResponse<TrophyProgress>
> = {
  method: "GET",
  path: "/api/v2/trophy/progress/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    ordering: args.ordering,
  }),
  responseSchema: paginatedResponseSchema(trophyProgressResponseSchema),
};

export const listUserTrophiesEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    ordering?: string | undefined;
    earned_at?: string | undefined;
    earned_at__gt?: string | undefined;
    earned_at__gte?: string | undefined;
    earned_at__lt?: string | undefined;
    earned_at__lte?: string | undefined;
    id?: number | undefined;
    id__in?: string | undefined;
    is_notified?: boolean | undefined;
    trophy?: number | undefined;
    trophy__in?: string | undefined;
    trophy__is_active?: boolean | undefined;
    trophy__is_hidden?: boolean | undefined;
    trophy__is_repeatable?: boolean | undefined;
    trophy__trophy_type?: string | undefined;
    trophy__trophy_type__in?: string | undefined;
  },
  WgerPaginatedResponse<UserTrophy>
> = {
  method: "GET",
  path: "/api/v2/user-trophy/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    ordering: args.ordering,
    earned_at: args.earned_at,
    earned_at__gt: args.earned_at__gt,
    earned_at__gte: args.earned_at__gte,
    earned_at__lt: args.earned_at__lt,
    earned_at__lte: args.earned_at__lte,
    id: args.id,
    id__in: args.id__in,
    is_notified: args.is_notified,
    trophy: args.trophy,
    trophy__in: args.trophy__in,
    trophy__is_active: args.trophy__is_active,
    trophy__is_hidden: args.trophy__is_hidden,
    trophy__is_repeatable: args.trophy__is_repeatable,
    trophy__trophy_type: args.trophy__trophy_type,
    trophy__trophy_type__in: args.trophy__trophy_type__in,
  }),
  responseSchema: paginatedResponseSchema(userTrophyResponseSchema),
};

export const getUserTrophyEndpoint: EndpointDescriptor<
  { id: number },
  UserTrophy
> = {
  method: "GET",
  path: (args) => `/api/v2/user-trophy/${args.id}/`,
  responseSchema: userTrophyResponseSchema,
};

export const listUserStatisticsEndpoint: EndpointDescriptor<
  {
    limit?: number | undefined;
    offset?: number | undefined;
    ordering?: string | undefined;
  },
  WgerPaginatedResponse<UserStatistics>
> = {
  method: "GET",
  path: "/api/v2/user-statistics/",
  mapParams: (args) => ({
    limit: args.limit,
    offset: args.offset,
    ordering: args.ordering,
  }),
  responseSchema: paginatedResponseSchema(userStatisticsResponseSchema),
};

export const getUserStatisticsEndpoint: EndpointDescriptor<
  { id: number },
  UserStatistics
> = {
  method: "GET",
  path: (args) => `/api/v2/user-statistics/${args.id}/`,
  responseSchema: userStatisticsResponseSchema,
};
