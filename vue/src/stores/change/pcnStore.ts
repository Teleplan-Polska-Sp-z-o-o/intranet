import { defineStore } from "pinia";
import { ComputedRef, computed, ref } from "vue";
import { PCNFilters } from "../../models/change/pcn/PCNFilters";
import { IProcessChangeRequest } from "../../interfaces/change/IProcessChangeRequest";
import { useUserStore } from "../userStore";
import { IProcessChangeNotice } from "../../interfaces/change/IProcessChangeNotice";
import { IUserEntity } from "../../interfaces/user/IUserEntity";

export const usePCNStore = defineStore("pcn", () => {
  const filters = ref<PCNFilters>(new PCNFilters());

  const callback = (itemsToFilter: Array<IProcessChangeRequest>): Array<IProcessChangeRequest> => {
    const userStore = useUserStore();
    if (areFilters(filters.value, new PCNFilters())) {
      return itemsToFilter.filter((item: IProcessChangeRequest) => {
        const flags: Array<boolean> = [];

        if (filters.value.onlyDesignated) {
          const personDesignated = item.processChangeNotice?.personDesignatedForImplementation
            ?.toLocaleLowerCase()
            .replace(" ", ".");
          flags.push((userStore.info() as IUserEntity).username === personDesignated);
        }

        if (filters.value.status) {
          flags.push(filters.value.status === item.processChangeNotice?.status);
        }

        if (filters.value.approvable) {
          const notice: IProcessChangeNotice | null = item.processChangeNotice;
          let nextDepartmentToApprove: "eng" | "qua" | "ded" | null = null;
          if (notice !== null) {
            if (!notice.engineeringDepartmentApproval) nextDepartmentToApprove = "eng";
            if (notice.engineeringDepartmentApproval && !notice.qualityDepartmentApproval)
              nextDepartmentToApprove = "qua";
            if (
              notice.engineeringDepartmentApproval &&
              notice.qualityDepartmentApproval &&
              !notice.dedicatedDepartmentApproval
            )
              nextDepartmentToApprove = "ded";
          }

          let department: string | undefined | null = null;
          switch (nextDepartmentToApprove) {
            case "eng":
              department = notice?.engineeringDepartmentName;
              break;
            case "qua":
              department = notice?.qualityDepartmentName;
              break;
            case "ded":
              department = item.dedicatedDepartment;
              break;

            default:
              break;
          }

          const userDepartment = (userStore.info() as IUserEntity).info.department;
          const isUserDecisionMaker = (userStore.info() as IUserEntity).info.decisionMaker;

          switch (filters.value.approvable) {
            case "By Me":
              flags.push(isUserDecisionMaker ? department === userDepartment : false);
              break;

            case "By My Department":
              flags.push(department === userDepartment);
              break;

            default:
              break;
          }
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

  const getFilter = (key: keyof PCNFilters): any => {
    if (filters.value.hasOwnProperty(key)) {
      return filters.value[key];
    } else {
      throw new Error(`Invalid filters key: ${key}`);
    }
  };

  const getFilters: ComputedRef<PCNFilters> = computed<PCNFilters>(() => filters.value);

  return { saveFilter, getFilters, getFilter, callback };
});
