type LogoSize = {
    Size?: string|undefined;
    Width?: number|undefined;
    Height?: number|undefined;
};

const Logo = ({Size, Width, Height}: LogoSize):JSX.Element => {
    const width = !(Size || Width) ? "100%" : (Size ? Size : Width + "px");
    const height = !(Size || Height) ? "100%" : (Size ? Size : Height + "px");

    return (
        <div className="pt-8 -m-4">
            <div className="flex justify-center items-center">
                <img src="./images/1XMM-logo.png" width={width} height={height}/>
            </div>
        </div>
    );
}

export default Logo;