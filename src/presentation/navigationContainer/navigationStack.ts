type HackerNewsFeedStack = {
  HomeScreen: undefined;
  WebViewScreen: {
    url: string;
  };
  FavoritesScreen: undefined;
};

type HackerNewsFeedDrawer = {
  MainScreen: HackerNewsFeedStack;
  CemeteryNewsScreen: undefined;
};

export type {HackerNewsFeedStack, HackerNewsFeedDrawer};
