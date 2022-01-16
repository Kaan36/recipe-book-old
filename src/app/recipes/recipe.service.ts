import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable({providedIn: 'root'})
export class RecipeService {

    recipesChanged = new Subject<Recipe[]>();
  

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

      constructor(private slService: ShoppingListService) {}

      getRecipes() {
          return this.recipes.slice();
      }

      getRecipebyID(id: number) {
          return this.recipes[id];  
      }

      addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.slService.addIngredients(ingredients);
      }

      addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());

      }

      updateRecipe(id: number, newRecipe: Recipe){
        this.recipes[id] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
      }

      deleteRecipe(id: number) {
        this.recipes.splice(id, 1);
        this.recipesChanged.next(this.recipes.slice());
      }

      deleteIngredient(recipeId: number, index: number) {
          this.recipes[recipeId].ingredients.splice(index, 1);
          this.recipesChanged.next(this.recipes.slice());
      }



}