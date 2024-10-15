type HackerNewsFeedStack = {
  HomeScreen: undefined;
  WebViewScreen: {
    url: string;
  };
  FavoritesScreen: undefined;
  OnboardingScreen: undefined;
};

type HackerNewsFeedDrawer = {
  MainScreen: HackerNewsFeedStack;
  FavoritesScreen: undefined;
  CemeteryNewsScreen: undefined;
};

type HackerNewsOnboardingScreens = {
  HomeScreen: undefined;
  PreferenceScreen: undefined;
};

export type {
  HackerNewsFeedStack,
  HackerNewsFeedDrawer,
  HackerNewsOnboardingScreens,
};
