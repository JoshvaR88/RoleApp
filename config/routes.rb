Rails.application.routes.draw do
  resources :roles do 
  	collection do 
  		get "hide_role"
  	end
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: 'roles#index'
end
