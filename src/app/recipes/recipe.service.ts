import { EventEmitter, Injectable } from "@angular/core";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable({providedIn: 'root'})
export class RecipeService {
    recipeSelected = new EventEmitter<Recipe>();

    private recipes: Recipe[] = [
        new Recipe(
            'Tasty Schnitzel', 
            'A super-tasty Schnitzel - just awesome', 
            'https://c.pxhere.com/images/22/4a/6321d069b3386c120e0c860dc56a-1620832.jpg!d',
            [
                new Ingredient('Meat', 1),
                new Ingredient('French Fries', 20)
            ]),
        new Recipe(
            'Big Fat Burger', 
            'What else you need to say?', 
            'https://c.pxhere.com/images/22/4a/6321d069b3386c120e0c860dc56a-1620832.jpg!d',
            [
                new Ingredient('Buns', 2),
                new Ingredient('Meat', 1)
            ])
      ];

      constructor(private slService: ShoppingListService) {

      }

      getRecipes() {
          return this.recipes.slice();
      }

      getRecipebyID(id: number) {
          return this.recipes[id];  
      }

      addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.slService.addIngredients(ingredients);
      }

}