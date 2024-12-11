import Header from "../components/Header";
// import { useUserStore } from "@/store/user-store";
export default function Profile() {
    // const user = useUserStore();
    return (
        <div
            className="flex-1 px-3 pb-20 bg-center bg-cover"
            style={{
                backgroundColor: `#064C7D`,
                backgroundImage: `url(/images/home/bg.png)`,
            }}
        >
            <Header />
            <div className="mt-4 mb-8">
                <div className="flex gap-2 w-100 text-sm">
                    <div className="bg-[#32363C] flex-1 text-center py-2 rounded-lg">
                        <span className="text-[#F79841] fw-semibold">Daily</span>
                        <span className="fw-light block">10-12-2024</span>
                    </div>
                    <div className="bg-[#32363C] flex-1 text-center py-2 rounded-lg">
                        <span className="text-[#6F72E2] fw-semibold">Weekly</span>
                        <span className="fw-light block">28 Nov - 4 Dec</span>
                    </div>
                    <div className="bg-[#32363C] flex-1 text-center py-2 rounded-lg">
                        <span className="text-[#84CB69] fw-semibold">Monthly</span>
                        <span className="fw-light block">Dec</span>
                    </div>
                </div>
                <div className="flex w-100 text-sm mt-5 items-end">
                    <div className="bg-[#32363C] flex-1 text-center py-2 h-38" style={{ borderTopLeftRadius: `1rem`, borderBottomLeftRadius: `1rem` }}>
                        <div className="relative w-full">
                            <img
                                src="/images/rating/top2.png"
                                alt="top2"
                                className="w-16 absolute -top-10 left-1/2 transform -translate-x-1/2"
                                style={{
                                    height: `4.5rem`,
                                }}
                            />
                        </div>
                        <div className="flex justify-center w-100 mt-3 pt-1 relative">
                            <img
                                src="/images/rating/avatar.png"
                                alt="avatar"
                                className="w-16 p-1 h-16"
                                style={{
                                    border: `3.77px solid transparent`,
                                    background: `linear-gradient(to bottom, #6E69F7 0%, #E496E7 100%)`,
                                    borderRadius: `50%`,
                                    backgroundClip: `padding-box, border-box`,
                                    backgroundOrigin: `padding-box, border-box`,
                                }}
                            />
                            <img
                                src="/images/rating/bg-top2.png"
                                alt="avatar"
                                className="w-5 h-5 absolute bottom-[-5px] left-1/2 transform -translate-x-1/2"
                            />
                            <span className="fw-bold text-xs absolute bottom-[-5px] left-1/2 transform -translate-x-1/2">
                                2
                            </span>
                        </div>
                        <span className="fw-light text-xs block pt-2">1%</span>
                        <span className="block fw-bold">Rachel</span>
                        <span className="flex fw-bold items-center justify-center">
                            <img
                                src="/images/home/coin.png"
                                alt="coin"
                                className="w-4 h-4"
                            />
                            123,981
                        </span>
                    </div>
                    <div className="bg-[#2E3034] flex-1 text-center py-2 h-56 relative" style={{ borderTopRightRadius: `2rem`, borderTopLeftRadius: `2rem` }}>
                        <div className="relative w-full">
                            <img
                                src="/images/rating/top1.png"
                                alt="top1"
                                className="w-16 absolute -top-10 left-1/2 transform -translate-x-1/2"
                                style={{
                                    height: `4.5rem`,
                                }}
                            />
                        </div>
                        <div className="flex justify-center w-100 mt-4 pt-1">
                            <img
                                src="/images/rating/avatar.png"
                                alt="avatar"
                                className="w-20 p-1 h-20"
                                style={{
                                    border: `3.77px solid transparent`,
                                    background: `linear-gradient(to bottom, #6E69F7 0%, #E496E7 100%)`,
                                    borderRadius: `50%`,
                                    backgroundClip: `padding-box, border-box`,
                                    backgroundOrigin: `padding-box, border-box`,
                                }}
                            />
                            <img
                                src="/images/rating/bg-top1.png"
                                alt="avatar"
                                className="w-5 h-5 absolute"
                                style={{
                                    top: `45%`
                                }}
                            />
                            <span className="fw-bold text-xs absolute" style={{
                                top: `46%`,
                            }}>1</span>
                        </div>
                        <span className="block fw-bold mt-3">Rachel</span>
                        <span className="fw-light text-xs block">31%</span>
                        <span className="flex text-lg fw-bold items-center justify-center mt-1">
                            <img
                                src="/images/home/coin.png"
                                alt="coin"
                                className="w-6 h-6"
                            />
                            123,981
                        </span>
                    </div>
                    <div className="bg-[#32363C] flex-1 text-center py-2 h-38" style={{ borderTopRightRadius: `1rem`, borderBottomRightRadius: `1rem` }}>
                        <div className="relative w-full">
                            <img
                                src="/images/rating/top3.png"
                                alt="top3"
                                className="w-16 absolute -top-10 left-1/2 transform -translate-x-1/2"
                                style={{
                                    height: `4.5rem`,
                                }}
                            />
                        </div>
                        <div className="flex justify-center w-100 mt-3 pt-1 relative">
                            <img
                                src="/images/rating/avatar.png"
                                alt="avatar"
                                className="w-16 p-1 h-16"
                                style={{
                                    border: `3.77px solid transparent`,
                                    background: `linear-gradient(to bottom, #6E69F7 0%, #E496E7 100%)`,
                                    borderRadius: `50%`,
                                    backgroundClip: `padding-box, border-box`,
                                    backgroundOrigin: `padding-box, border-box`,
                                }}
                            />
                            <img
                                src="/images/rating/bg-top3.png"
                                alt="avatar"
                                className="w-5 h-5 absolute bottom-[-5px] left-1/2 transform -translate-x-1/2"
                            />

                            <span className="fw-bold text-xs absolute bottom-[-5px] left-1/2 transform -translate-x-1/2">
                                3
                            </span>
                        </div>

                        <span className="fw-light text-xs block pt-2">1%</span>
                        <span className="block fw-bold">Rachel</span>
                        <span className="flex fw-bold items-center justify-center">
                            <img
                                src="/images/home/coin.png"
                                alt="coin"
                                className="w-4 h-4"
                            />
                            123,981
                        </span>
                    </div>
                </div>
                <div className="w-100 text-sm p-3">
                    <div className="row p-2 rounded-xl items-center bg-[#19203b]">
                        <div className="col-2 flex justify-center items-center p-0">
                            <span
                                className="border items-center justify-center fw-light"
                                style={{
                                    borderRadius: '50%',
                                    border: '2px solid #fff',
                                    minWidth: '23px',
                                    minHeight: '23px',
                                    display: 'inline-flex',
                                }}
                            >
                                4
                            </span>
                        </div>

                        <div className="col-2 flex justify-center items-center p-0">
                            <img
                                src="/images/rating/avatar.png"
                                alt="avatar"
                                className="p-1 w-100"
                            />
                        </div>
                        <div className="col-5">
                            <span className="fw-bold block">Madelyn Dias</span>
                            <span className="fw-light block text-xs">590 points</span>
                        </div>
                        <div className="col-3 flex items-center justify-end">
                            <img
                                src="/images/home/polygon.png"
                                alt="avatar"
                                className="h-3 w-3"
                            /> &nbsp;
                            <span
                                className="border items-center justify-center fw-light"
                                style={{
                                    borderRadius: '50%',
                                    border: `2px solid #fff`,
                                    minWidth: `30px`,
                                    minHeight: `30px`,
                                    display: `inline-flex`,
                                    fontSize: `10px`
                                }}
                            >
                                +41%
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-100 text-sm p-3 pt-0">
                    <div className="row p-2 rounded-xl items-center bg-[#19203b]">
                        <div className="col-2 flex justify-center items-center p-0">
                            <span
                                className="border items-center justify-center fw-light"
                                style={{
                                    borderRadius: '50%',
                                    border: '2px solid #fff',
                                    minWidth: '23px',
                                    minHeight: '23px',
                                    display: 'inline-flex',
                                }}
                            >
                                5
                            </span>
                        </div>

                        <div className="col-2 flex justify-center items-center p-0">
                            <img
                                src="/images/rating/avatar.png"
                                alt="avatar"
                                className="p-1 w-100"
                            />
                        </div>
                        <div className="col-5">
                            <span className="fw-bold block">Madelyn Dias</span>
                            <span className="fw-light block text-xs">590 points</span>
                        </div>
                        <div className="col-3 flex items-center justify-end">
                            <img
                                src="/images/home/down-red.png"
                                alt="avatar"
                                className="h-3 w-3"
                            /> &nbsp;
                            <span
                                className="border items-center justify-center fw-light"
                                style={{
                                    borderRadius: '50%',
                                    border: `2px solid #fff`,
                                    minWidth: `30px`,
                                    minHeight: `30px`,
                                    display: `inline-flex`,
                                    fontSize: `10px`
                                }}
                            >
                                +41%
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
