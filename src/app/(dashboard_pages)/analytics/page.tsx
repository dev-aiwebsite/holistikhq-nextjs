import { Analytics } from "@app/components/Analytics";

const AnalyticsPage = () => {
    return (
        <div>
            <div className="header-h">
                <div className="py-4">
                    <div className="flex flex-row items-center gap-2">
                        <span className="capitalize text-2xl font-bold">Analytics</span>
                    </div>
                </div>
            </div>
            <Analytics showTitle={false} />
        </div>
    );
}

export default AnalyticsPage;
