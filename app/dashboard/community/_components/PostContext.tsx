import React, { createContext, useState, useContext, ReactNode } from 'react';

type PostContextType = {
  shouldRefreshPosts: boolean;
  triggerPostRefresh: () => void;
};

const PostContext = createContext<PostContextType>({
  shouldRefreshPosts: false,
  triggerPostRefresh: () => {},
});

export const PostProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [shouldRefreshPosts, setShouldRefreshPosts] = useState(false);

  const triggerPostRefresh = () => {
    setShouldRefreshPosts(true);
  };

  return (
    <PostContext.Provider value={{ 
      shouldRefreshPosts, 
      triggerPostRefresh 
    }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = () => useContext(PostContext);
