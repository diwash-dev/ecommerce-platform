import { Star, StarHalf, Stars } from "lucide-react";
import { colors } from "./color";

export const starsGenerator = (
    rating,
    stroke = "0",
    size,
    fill = colors.Yellow
) => {

    return Array.from({ length: 5 }, (Element, index) => {

        const number = index + 0.5;
        return <span key={index}>

            {
                rating >= index + 1 ? (
                    <Star fill={fill} stroke={stroke} size={size} />
                ) : (
                    rating >= number ?
                    ( 
                    <StarHalf fill={fill} stroke={stroke} size={size} />

                     ) : <Star stroke={colors.Yellow} size={size} />
                )
            }

        </span>
    }

    );
};