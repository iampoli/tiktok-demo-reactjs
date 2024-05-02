
// constructor function
function Validator(options){
    function getParent(element, selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var selectorRule = {};

    function validate (inputElement,rule){
        var errorMessage ;
        var errorElement = getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector);
        
        // lay ra cac rule cua selector
        var rules = selectorRule[rule.selector];

        // lap qua tung rule va kiem tra
        // neu co loi dung viec kiem tra
        for(var i = 0; i<rules.length; ++i){
            switch(inputElement.type){
                case 'checkbox':
                    case 'radio': errorMessage = rules[i](formElement.querySelector(rule.selector+ ':checked'))
                    break;
         
          default:  errorMessage = rules[i](inputElement.value)
            }
          
          if(errorMessage) break;
        }
        
        if(errorMessage){
          inputElement.parentElement.classList.add("invalid")
          errorElement.innerText = errorMessage;
        }else{
          inputElement.parentElement.classList.remove("invalid")
          errorElement.innerText = ""
        }
        return !errorMessage;
    } 

    var formElement= document.querySelector(options.form)
    if(formElement){
        // thuc hien tat ca
        formElement.onsubmit = function(e){
            e.preventDefault();
            var isFormValid = true;
            options.rules.forEach((rule)=>{
                var inputElement= formElement.querySelector(rule.selector);

                
                var isValid = validate(inputElement,rule);
                if(!isValid){
                    isFormValid=false;
                }
            })
            
            if(isFormValid){
                if(typeof options.onSubmit === 'function'){
                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])')
            var formValues = Array.from(enableInputs).reduce(function(values,input){
                
                switch(input.type){
                    case'radio':
                    case'checkbox': 
                    values[input.name] = formElement.querySelector('input[name="'+input.name + '"]:checked').value
                    
                    break;
                    default:
                        values[input.name] = input.value;
                }
                return values;
            },{});
                    options.onSubmit(formValues)
                }
            };
        }

        // xu ly lap qua moi rule va xu ly (blur input ,event list...)
        options.rules.forEach(function(rule){

            // luu lai cac rule cho moi input
            if(Array.isArray(selectorRule[rule.selector])){
                selectorRule[rule.selector].push(rule.test)
            }else{
                selectorRule[rule.selector] = [rule.test]
            }

             var inputElements = formElement.querySelectorAll(rule.selector);
             Array.from(inputElements).forEach(function(inputElement){
                if(inputElement){
                    // su ly onblur
                    inputElement.onblur = function(){
    
                        validate(inputElement,rule);
                    }
    
                    // su ly khi nguoi dung nhap
                    inputElement.oninput = function(){
                        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
                        getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
                        errorElement.innerText = ""
                    }
                 }
            })
             })
             
    }
}

// dinh nghia rule
Validator.isRequired=function(selector,message){
    return {
        selector : selector,
        test: function(value){
            return value ? undefined :message|| "Vui long nhap truong nay"
        }
    }
}

Validator.isEmail= function(selector,message){
    return {
        selector: selector,
        test: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
           return regex.test(value) ? undefined : message ||"Truong nay phai la email";
        }
    }
}


Validator.minLength= function(selector,min,message){
    return {
        selector: selector,
        test: function(value){
            return value.length >= min ? undefined : message||`Vui long nhập tối thiểu ${min} ký tụ`
        }
    }
}


Validator.isConfirmed = function(selector,getConfirmValue,message){
    return {
        selector: selector,
        test: function(value){
            return value === getConfirmValue() ? undefined :message || 'Gia tri nhap khong khop'
        }
    }
}