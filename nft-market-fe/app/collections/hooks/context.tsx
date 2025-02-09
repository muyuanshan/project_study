// 这里提供一个上下文，在他包裹的组件都可以直接访问里面的参数
// 类似于storage，但是是全局的

import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

type CollectionContextType = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export const CollectionContext = createContext<CollectionContextType>({
  activeTab: "collections",
  setActiveTab: () => {},
});

export const CollectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeTab, setActiveTab] = useState("collections");
  const router = useRouter();

  useEffect(() => {
    const initialTab = window.location.hash.slice(1);
    if (!initialTab) {
      router.push("#trending");
      setActiveTab("trending");
    } else {
      setActiveTab(initialTab);
    }
  }, []);
  return (
    <CollectionContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </CollectionContext.Provider>
  );
};

// 用法
/**
 * 
 * <CollectionProvider>
 *  <Collection />
 * </CollectionProvider>
 */

/**
 * 子组件
 * const { activeTab, setActiveTab } = useContext(CollectionContext);
 */
