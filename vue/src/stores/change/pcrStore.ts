import { defineStore } from "pinia";
import { ComputedRef, computed, ref } from "vue";
import { PCRFilters } from "../../models/change/pcr/PCRFilters";
import { IProcessChangeRequest } from "../../interfaces/change/IProcessChangeRequest";
import { useUserStore } from "../userStore";
import { IUser } from "../../interfaces/user/IUser";

export const usePCRStore = defineStore("pcr", () => {
  const filters = ref<PCRFilters>(new PCRFilters());

  const callback = (itemsToFilter: Array<IProcessChangeRequest>): Array<IProcessChangeRequest> => {
    const userStore = useUserStore();
    if (areFilters(filters.value, new PCRFilters())) {
      return itemsToFilter.filter((item: IProcessChangeRequest) => {
        const flags: Array<boolean> = [];

        if (filters.value.onlyOwned) {
          const reconextOwner = item.reconextOwner.toLocaleLowerCase().replace(" ", ".");
          flags.push((userStore.info() as IUser).username === reconextOwner);
        }

        if (filters.value.status) {
          flags.push(filters.value.status === item.status);
        }

        return !flags.includes(false);
      });
    } else return itemsToFilter;
  };

  const areFilters = (obj1: Record<string, any>, obj2: Record<string, any>): boolean => {
    for (const key in obj1) {
      if (obj1[key] !== obj2[key]) {
        return true;
      }
    }

    return false;
  };

  // const filtered = computed(() => {
  //   if (search.value) {
  //     return items.value.filter((item: any) => {
  //       for (const key of props.searchBy) {
  //         const value = item[key]?.toLowerCase();
  //         const searchTerm = search.value.toLowerCase();
  //         if (value && value.includes(searchTerm)) {
  //           return true;
  //         }
  //       }
  //       return false;
  //     });
  //   } else return items.value;
  // });

  const saveFilter = (value: any, key: string): void => {
    filters.value = {
      ...filters.value,
      [key]: value,
    };
  };

  const getFilter = (key: keyof PCRFilters): any => {
    if (filters.value.hasOwnProperty(key)) {
      return filters.value[key];
    } else {
      throw new Error(`Invalid filters key: ${key}`);
    }
  };

  const getFilters: ComputedRef<PCRFilters> = computed<PCRFilters>(() => filters.value);

  return { saveFilter, getFilters, getFilter, callback };
});
