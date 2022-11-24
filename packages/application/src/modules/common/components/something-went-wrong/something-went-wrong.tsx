import { Banner, Stack } from '@servicetitan/design-system';

export const SomethingWentWrong = () => {
    return (
        <Stack justifyContent="center" alignItems="center" className="h-100 w-100">
            <Banner
                className="of-hidden"
                status="warning"
                icon
                onPrimaryActionClick={() => {
                    window.location.reload();
                }}
                primaryActionName="Թարմացնել"
                title=""
            >
                Համակարգում որոշ խնդիրներ կան, խնդրում ենք թարմացնել էջը՝ սեղմելով "թարմացնել"
                կոճակը կամ կապ հաստատել մեզ հետ, եթե խնդիրը չլուծվի։
            </Banner>
        </Stack>
    );
};
