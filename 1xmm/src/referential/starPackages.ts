import { StarPackage } from "@/types/StarPackage";

export const StarPackages: Array<StarPackage> = [
    createStarPackages(1, 50, 0),
    createStarPackages(2, 100, 5),
    createStarPackages(3, 250, 10),
    createStarPackages(4, 500, 20),
    createStarPackages(5, 1000, 30),
];

function createStarPackages(id: number, number_of_stars: number, discount: number): StarPackage {
    const StarPackage: StarPackage = {
        id: id,
        number_of_stars: number_of_stars,
        discount: discount,
        cost: number_of_stars * 0.025
    };

    return StarPackage;
}