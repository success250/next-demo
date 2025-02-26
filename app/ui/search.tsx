"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function Search({ placeholder }: { placeholder: string }) {
  const params = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  // input时间在键盘按下每一个字符时都会触发, 需要做防抖节流
  // 同时这里中文输入法会额外有一个组词时间, 需要那个判断一下, 如果支持中文输入的话
  // 另外这里可以使用 form 表单的 submit 提交功能, 只有用户提交或者按下回车才会触发
  const handleSearch = useDebouncedCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      // 这个 URLSearchParams 是 DOM API, 支持使用 set 修改当前页面的搜索参数
      // 这个需要手动修改替换当前页面的search才可以生效
      const search = new URLSearchParams(params);
      if (query) {
        search.set("query", query);
      } else {
        search.delete("query");
      }
      search.set("page", "1");
      console.log("search: ", search.toString());
      replace(`${pathname}?${search}`);
    },
    500
  );
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={handleSearch}
        defaultValue={params.get("query")?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
