import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import PollingStationMap from "@/components/PollingStationMap";

const PollingStations: React.FC = () => {
  return (
    <div className="p-6">
      <Card className="campaign-card">
        <CardHeader>
          <CardTitle>Polling Stations</CardTitle>
          <p className="text-muted-foreground text-sm">
            Explore polling station locations
          </p>
        </CardHeader>
        <CardContent>
          <PollingStationMap />
          <p className="text-muted-foreground text-sm mt-2">
            Click a marker to view station details
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PollingStations;