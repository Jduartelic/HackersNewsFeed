type HackerNewsFeedStack = {
  HomeScreen: undefined;
  WebViewScreen: {
    url: string;
  };
  FavoritesScreen: undefined;
};

type HackerNewsFeedDrawer = {
  MainScreen: HackerNewsFeedStack;
};

export type {HackerNewsFeedStack, HackerNewsFeedDrawer};
