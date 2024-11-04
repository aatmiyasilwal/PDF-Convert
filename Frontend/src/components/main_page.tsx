import { barStyle } from "../css_styles";

export const Header: React.FC<{}> = function () {
    return (
        <div style={barStyle}>
            <h2 style={{color:'black'}}>PDF Convert</h2>
        </div>
    );
};