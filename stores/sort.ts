type SortOrder = {
  year: "asc" | "desc";
  month: "asc" | "desc";
  message: "asc" | "desc";
  latest: "asc" | "desc";
};

export const useSortStore = defineStore(
  "sort",
  () => {
    const sortOrder = reactive<SortOrder>({
      year: "asc",
      month: "asc",
      message: "asc",
      latest: "asc",
    });

    function toggleSortOrder(id: keyof typeof sortOrder) {
      sortOrder[id] === "asc"
        ? (sortOrder[id] = "desc")
        : (sortOrder[id] = "asc");
    }

    const updateCookieExperation = ref(false);

    return { sortOrder, toggleSortOrder, updateCookieExperation };
  },
  { persist: true },
);
