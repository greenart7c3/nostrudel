import React, { Suspense } from "react";
import { createHashRouter, Outlet, RouterProvider, ScrollRestoration } from "react-router-dom";
import { Spinner } from "@chakra-ui/react";
import { css, Global } from "@emotion/react";

import { ErrorBoundary } from "./components/error-boundary";
import Layout from "./components/layout";

import HomeView from "./views/home/index";
import SettingsView from "./views/settings";
import LoginView from "./views/login";
import ProfileView from "./views/profile";
import HashTagView from "./views/hashtag";
import UserView from "./views/user";
import UserNotesTab from "./views/user/notes";
import UserFollowersTab from "./views/user/followers";
import UserRelaysTab from "./views/user/relays";
import UserFollowingTab from "./views/user/following";
import NoteView from "./views/note";
import LoginStartView from "./views/login/start";
import LoginNpubView from "./views/login/npub";
import NotificationsView from "./views/notifications";
import LoginNip05View from "./views/login/nip05";
import LoginNsecView from "./views/login/nsec";
import UserZapsTab from "./views/user/zaps";
import DirectMessagesView from "./views/messages";
import DirectMessageChatView from "./views/messages/chat";
import NostrLinkView from "./views/link";
import UserReportsTab from "./views/user/reports";
import ToolsHomeView from "./views/tools";
import UserAboutTab from "./views/user/about";
import UserReactionsTab from "./views/user/reactions";
import useSetColorMode from "./hooks/use-set-color-mode";
import UserStreamsTab from "./views/user/streams";
import { PageProviders } from "./providers";
import RelaysView from "./views/relays";
import RelayView from "./views/relays/relay";
import RelayReviewsView from "./views/relays/reviews";
import ListsView from "./views/lists";
import ListDetailsView from "./views/lists/list-details";
import UserListsTab from "./views/user/lists";

import BrowseListView from "./views/lists/browse";
import EmojiPacksBrowseView from "./views/emoji-packs/browse";
import EmojiPackView from "./views/emoji-packs/emoji-pack";
import UserEmojiPacksTab from "./views/user/emoji-packs";
import EmojiPacksView from "./views/emoji-packs";
import GoalsView from "./views/goals";
import GoalsBrowseView from "./views/goals/browse";
import GoalDetailsView from "./views/goals/goal-details";
import UserGoalsTab from "./views/user/goals";
import NetworkView from "./views/tools/network";
import MutedByView from "./views/user/muted-by";
import BadgesView from "./views/badges";
import BadgesBrowseView from "./views/badges/browse";
import BadgeDetailsView from "./views/badges/badge-details";
import UserArticlesTab from "./views/user/articles";
import DrawerSubViewProvider from "./providers/drawer-sub-view-provider";

const StreamsView = React.lazy(() => import("./views/streams"));
const StreamView = React.lazy(() => import("./views/streams/stream"));
const SearchView = React.lazy(() => import("./views/search"));
const MapView = React.lazy(() => import("./views/map"));

const overrideReactTextareaAutocompleteStyles = css`
  .rta__autocomplete {
    z-index: var(--chakra-zIndices-popover);
    font-size: var(--chakra-fontSizes-md);
  }
  .rta__list {
    background: var(--chakra-colors-chakra-subtle-bg);
    color: var(--chakra-colors-chakra-body-text);
    border: var(--chakra-borders-1px) var(--chakra-colors-chakra-border-color);
    border-radius: var(--chakra-sizes-1);
    overflow: hidden;
  }
  .rta__entity {
    background: none;
    color: inherit;
    padding: var(--chakra-sizes-1) var(--chakra-sizes-2);
  }
  .rta__entity--selected {
    background: var(--chakra-ring-color);
  }
  .rta__item:not(:last-child) {
    border-bottom: var(--chakra-borders-1px) var(--chakra-colors-chakra-border-color);
  }
`;

const RootPage = () => {
  useSetColorMode();

  return (
    <PageProviders>
      <Layout>
        <ScrollRestoration />
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </Layout>
    </PageProviders>
  );
};

const router = createHashRouter([
  {
    path: "login",
    element: <LoginView />,
    children: [
      { path: "", element: <LoginStartView /> },
      { path: "npub", element: <LoginNpubView /> },
      { path: "nip05", element: <LoginNip05View /> },
      { path: "nsec", element: <LoginNsecView /> },
    ],
  },
  {
    path: "streams/:naddr",
    element: (
      <PageProviders>
        <StreamView />
      </PageProviders>
    ),
  },
  {
    path: "map",
    element: <MapView />,
  },
  {
    path: "/",
    element: <RootPage />,
    children: [
      {
        path: "/u/:pubkey",
        element: <UserView />,
        children: [
          { path: "", element: <UserAboutTab /> },
          { path: "about", element: <UserAboutTab /> },
          { path: "notes", element: <UserNotesTab /> },
          { path: "articles", element: <UserArticlesTab /> },
          { path: "streams", element: <UserStreamsTab /> },
          { path: "zaps", element: <UserZapsTab /> },
          { path: "likes", element: <UserReactionsTab /> },
          { path: "lists", element: <UserListsTab /> },
          { path: "followers", element: <UserFollowersTab /> },
          { path: "following", element: <UserFollowingTab /> },
          { path: "goals", element: <UserGoalsTab /> },
          { path: "emojis", element: <UserEmojiPacksTab /> },
          { path: "relays", element: <UserRelaysTab /> },
          { path: "reports", element: <UserReportsTab /> },
          { path: "muted-by", element: <MutedByView /> },
        ],
      },
      {
        path: "/n/:id",
        element: <NoteView />,
      },
      { path: "settings", element: <SettingsView /> },
      { path: "relays/reviews", element: <RelayReviewsView /> },
      { path: "relays", element: <RelaysView /> },
      { path: "r/:relay", element: <RelayView /> },
      { path: "notifications", element: <NotificationsView /> },
      { path: "search", element: <SearchView /> },
      { path: "dm", element: <DirectMessagesView /> },
      { path: "dm/:key", element: <DirectMessageChatView /> },
      { path: "profile", element: <ProfileView /> },
      {
        path: "tools",
        children: [
          { path: "", element: <ToolsHomeView /> },
          { path: "network", element: <NetworkView /> },
        ],
      },
      {
        path: "lists",
        children: [
          { path: "", element: <ListsView /> },
          { path: "browse", element: <BrowseListView /> },
          { path: ":addr", element: <ListDetailsView /> },
        ],
      },
      {
        path: "goals",
        children: [
          { path: "", element: <GoalsView /> },
          { path: "browse", element: <GoalsBrowseView /> },
          { path: ":id", element: <GoalDetailsView /> },
        ],
      },
      {
        path: "badges",
        children: [
          { path: "", element: <BadgesView /> },
          { path: "browse", element: <BadgesBrowseView /> },
          { path: ":naddr", element: <BadgeDetailsView /> },
        ],
      },
      {
        path: "emojis",
        children: [
          { path: "", element: <EmojiPacksView /> },
          { path: "browse", element: <EmojiPacksBrowseView /> },
          { path: ":addr", element: <EmojiPackView /> },
        ],
      },
      {
        path: "streams",
        element: <StreamsView />,
      },
      { path: "l/:link", element: <NostrLinkView /> },
      { path: "t/:hashtag", element: <HashTagView /> },
      {
        path: "",
        element: <HomeView />,
      },
    ],
  },
]);

export const App = () => (
  <ErrorBoundary>
    <DrawerSubViewProvider parentRouter={router}>
      <Global styles={overrideReactTextareaAutocompleteStyles} />
      <Suspense fallback={<Spinner />}>
        <RouterProvider router={router} />
      </Suspense>
    </DrawerSubViewProvider>
  </ErrorBoundary>
);
