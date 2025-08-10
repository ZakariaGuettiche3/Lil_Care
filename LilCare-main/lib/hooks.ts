"use client";
import {
  DependencyList,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { supabaseBrowser } from "./supabase/browser";
import {
  AuthUser,
  SignInWithPasswordCredentials,
  SignOut,
  User,
  UserResponse,
} from "@supabase/supabase-js";

import { StateCreator, StoreApi, UseBoundStore, create } from "zustand";
import { messages } from "../db/schema";
import {
    ChatMessage,
    Children,
    EventData,
    InvoiceData,
    MessageData,
    ModuleData,
    NotificationData, ParentData,
    PreregistrationData,
    SectionData,
    UserAuth,
    UserAuthData,
    UsersAuthSelect,
} from "@/types";

export type ApiState<T> = {
  data?: T;
  isFetching: boolean;
  error?: string;
  setData: Dispatch<SetStateAction<T | undefined>>;
};



export const useApi = <T>(
  callback: () => Promise<T | undefined>,
  dep?: DependencyList,
  finish?: {
    onSuccess?: (response?: any) => Promise<void>;
    onError?: (error: string) => void;
  }
): ApiState<T> => {
  const [data, setData] = useState<T>();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [err, setError] = useState<string>();

  useEffect(() => {
    setIsFetching(true);
    try {
      callback()
        .then((data) => {
          setData(data);
          return data;
        })
        .then((data) => {
          finish?.onSuccess?.(data);
        });
    } catch (error) {
      const err = error as Error;
      setError(err.message);
      finish?.onError?.(err.message);
    }
    setIsFetching(false);
  }, dep);

  return { data, setData, isFetching, error: err };
};

export type TableState<T = any> = {
  data: T[];
  rows: T[];
  itemsPerPage: number;
  currentPage: number;
  pageCount: number;
  selectedRows: T[];
  ActionRow?: T;
  addRow: (row: T) => void;
  updateRow?: (row: T, callback: (data: T[], row: T) => T[]) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  filter: (filter: (row: T) => boolean) => void;
  listenData?: () => void;
  getRows: () => T[];
  deleteRow?: (row: T) => void;
  getSelectedRows: () => T[];
  selectAll: (rows?: T[]) => void;
  deselectAll: () => void;
  setPageIndex: (index: number) => void;
  canGetNextPage: () => boolean;
  canGetPreviousPage: () => boolean;
  getNextPage: () => T[];
  getPreviousPage: () => T[];
  addToSelectedRows: (row: T) => void;
  deselectRow: (row: T) => void;
  setInAction?: (row: T) => void;
  setData: (data: T[]) => void;
};

const tableStoreSelector =
  <T extends { id: any }>(): StateCreator<TableState<T>> =>
  (set, state) =>
    ({
      data: [],
      rows: state()?.data,
      selectedRows: [],
      itemsPerPage: 3,
      ActionRow: undefined,
      addRow: (row) => set((state) => ({ data: [...state.data, row] })),
      setInAction: (row) => set({ ActionRow: row }),
      getRows: () => state()?.data?.slice(0, state()?.itemsPerPage),
      setPageIndex: (index) => {
        set((state) => ({
          ...state,
          rows: state.data.slice(
            index * state.itemsPerPage,
            state.itemsPerPage + index * state.itemsPerPage
          ),
        }));
      },
      currentPage: 1,
      filter: (filter) => set((state) => ({ data: state.data.filter(filter) })),
      selectAll: () => set((st) => ({ ...state, selectedRows: state().data })),
      deselectAll: () => set((state) => ({ ...state, selectedRows: [] })),
      updateRow: (row, callback) => {
        set((state) => ({ data: callback(state.data, row) }));
      },
      setItemsPerPage: (itemsPerPage) =>
        set((state) => ({
          itemsPerPage,
          pageCount: Math.floor(state.data.length / itemsPerPage) + 1,
          rows: state?.data.slice(0, itemsPerPage),
        })),
      deleteRow: (row) => {
        set((state) => ({ data: state.data.filter((r) => r.id !== row.id) }));
      },
      deselectRow: (row) =>
        set((state) => ({
          ...state,
          selectedRows: state.selectedRows.filter((Row) => Row !== row),
        })),
      addToSelectedRows: (row) => {
        set((state) => ({ selectedRows: [...state.selectedRows, row] }));
      },
      getSelectedRows: () => state()?.selectedRows || [],
      pageCount: 1,
      canGetNextPage: () => {
        console.log(state()?.pageCount, state()?.currentPage);
        return state()?.pageCount > state()?.currentPage;
      },
      canGetPreviousPage: () => state()?.currentPage > 1,
      getNextPage: () => {
        set((state) => {
          const { data, itemsPerPage, currentPage, canGetNextPage } = state;
          if (canGetNextPage()) {
            let firstIndex = currentPage * itemsPerPage;
            return {
              currentPage: currentPage + 1,
              rows: data.slice(firstIndex, firstIndex + itemsPerPage),
            };
          } else {
            return state;
          }
        });

        return state()?.rows;
      },
      getPreviousPage: () => {
        set((state) => {
          const { data, rows, itemsPerPage, currentPage, canGetPreviousPage } =
            state;
          if (canGetPreviousPage()) {
            let firstIndex = (currentPage - 2) * itemsPerPage;
            return {
              currentPage: currentPage - 1,
              rows: state.data.slice(firstIndex, firstIndex + itemsPerPage),
            };
          } else {
            return state;
          }
        });

        return state()?.rows;
      },
      setData: (data: T[]) => set({ data }),
    } as TableState<T>);

// children state management
export const useChildrenTable = create<TableState<Children>>()(
  tableStoreSelector<Children>()
);

// user state management
export const useUserTable = create<TableState<UsersAuthSelect>>()(
  tableStoreSelector<UsersAuthSelect>()
);

export const useParentsTable = create<TableState<UsersAuthSelect<ParentData>>>()(
    tableStoreSelector<UsersAuthSelect<ParentData>>()
);

export const useNotificationsTable  = create<TableState<NotificationData>>(
    tableStoreSelector<NotificationData>()
)

// section state management
export const useSectionTable = create<TableState<SectionData>>()(
  tableStoreSelector<SectionData>()
);

// message state managment
export const useMessagesTable = create<TableState<MessageData>>(
  tableStoreSelector<MessageData>()
);

export const usePreregistrationTable = create<
  TableState<PreregistrationData>
>()(tableStoreSelector<PreregistrationData>());

// notification state management
export const useNotificationTable = create<TableState<NotificationData>>(
  tableStoreSelector<NotificationData>()
);

export const useModuleStore = create<TableState<ModuleData>>(
  tableStoreSelector<ModuleData>()
);

// events state managment
export const useEventsTable = create<TableState<EventData>>(
  tableStoreSelector<EventData>()
);

export const useInvoicesTable = create<TableState<InvoiceData>>(
  tableStoreSelector<InvoiceData>()
);

type UserState = {
  login: (credentials: { email: string; password: string }) => void;
  LogOut: () => void;
  currentUser?: User;
};

const supabase =  supabaseBrowser();
const UserSessionSelector = (): StateCreator<UserState> => (set, state) => {
  supabase?.auth?.getSession().then((res) => {
    set({ currentUser: res.data.session?.user || undefined });
  });
  return {
    currentUser: undefined,
    login: ({ password, email }) => {
      supabase.auth.signInWithPassword({ email, password }).then((res) => {
        set({ currentUser: res.data.user || undefined });
      });
    },
    LogOut: (options?: SignOut) => {
      supabase.auth.signOut(options).then((res) => {
        set({ currentUser: undefined });
      });
    },
  };
};

export const useSessionUser = create<UserState>()(UserSessionSelector());
