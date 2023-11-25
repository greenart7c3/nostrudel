import { useMemo } from "react";
import { Flex, useDisclosure } from "@chakra-ui/react";
import { Kind } from "nostr-tools";

import RequireCurrentAccount from "../../providers/require-current-account";
import TimelineActionAndStatus from "../../components/timeline-page/timeline-action-and-status";
import IntersectionObserverProvider from "../../providers/intersection-observer";
import useSubject from "../../hooks/use-subject";
import { useTimelineCurserIntersectionCallback } from "../../hooks/use-timeline-cursor-intersection-callback";
import { useNotificationTimeline } from "../../providers/notification-timeline";
import { isReply } from "../../helpers/nostr/events";
import PeopleListProvider, { usePeopleListContext } from "../../providers/people-list-provider";
import PeopleListSelection from "../../components/people-list-selection/people-list-selection";
import VerticalPageLayout from "../../components/vertical-page-layout";
import NotificationItem from "./notification-item";
import NotificationTypeToggles from "./notification-type-toggles";

function NotificationsPage() {
  const { people } = usePeopleListContext();
  const peoplePubkeys = useMemo(() => people?.map((p) => p.pubkey), [people]);

  const showReplies = useDisclosure({ defaultIsOpen: true });
  const showMentions = useDisclosure({ defaultIsOpen: true });
  const showZaps = useDisclosure({ defaultIsOpen: true });
  const showReposts = useDisclosure({ defaultIsOpen: true });
  const showReactions = useDisclosure({ defaultIsOpen: true });

  const timeline = useNotificationTimeline();
  const callback = useTimelineCurserIntersectionCallback(timeline);
  const events = useSubject(timeline?.timeline).filter((e) => {
    if (peoplePubkeys && e.kind !== Kind.Zap && !peoplePubkeys.includes(e.pubkey)) return false;

    if (e.kind === Kind.Text) {
      if (!showReplies.isOpen && isReply(e)) return false;
      if (!showMentions.isOpen && !isReply(e)) return false;
    }
    if (!showReactions.isOpen && e.kind === Kind.Reaction) return false;
    if (!showReposts.isOpen && e.kind === Kind.Repost) return false;
    if (!showZaps.isOpen && e.kind === Kind.Zap) return false;

    return true;
  });

  return (
    <IntersectionObserverProvider callback={callback}>
      <VerticalPageLayout>
        <Flex gap="2">
          <NotificationTypeToggles
            showReplies={showReplies}
            showMentions={showMentions}
            showZaps={showZaps}
            showReactions={showReactions}
            showReposts={showReposts}
          />
          <PeopleListSelection flexShrink={0} />
        </Flex>

        {events.map((event) => (
          <NotificationItem key={event.id} event={event} />
        ))}
        <TimelineActionAndStatus timeline={timeline} />
      </VerticalPageLayout>
    </IntersectionObserverProvider>
  );
}

export default function NotificationsView() {
  return (
    <RequireCurrentAccount>
      <PeopleListProvider initList="global">
        <NotificationsPage />
      </PeopleListProvider>
    </RequireCurrentAccount>
  );
}
