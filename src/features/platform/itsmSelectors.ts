import { connectorSeed, deliveryLogSeed, subscriptionSeed } from './itsmSeed';

export function selectItsmView(connectorId?: string, eventCategory?: string) {
  const connectors = connectorId ? connectorSeed.filter((x) => x.id === connectorId) : connectorSeed;

  const subscriptions = subscriptionSeed.filter((sub) => {
    if (connectorId && sub.connectorId !== connectorId) return false;
    if (eventCategory && sub.eventCategory !== eventCategory) return false;
    return true;
  });

  const deliveries = deliveryLogSeed.filter((log) => {
    if (connectorId && log.connectorId !== connectorId) return false;
    if (eventCategory && log.eventCategory !== eventCategory) return false;
    return true;
  });

  return {
    connectors,
    subscriptions,
    deliveries,
    totals: {
      connectors: connectors.length,
      subscriptions: subscriptions.length,
      deliveries: deliveries.length,
      activeSubscriptions: subscriptions.filter((sub) => sub.enabled).length
    }
  };
}
