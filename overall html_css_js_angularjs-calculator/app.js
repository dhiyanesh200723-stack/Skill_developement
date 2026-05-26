angular.module('calculatorApp', [])
    .controller('CalculatorController', function() {
        var vm = this;
        
        vm.currentOperand = '';
        vm.previousOperand = '';
        vm.operation = undefined;

        vm.clear = function() {
            vm.currentOperand = '';
            vm.previousOperand = '';
            vm.operation = undefined;
        };

        vm.delete = function() {
            vm.currentOperand = vm.currentOperand.toString().slice(0, -1);
        };

        vm.appendNumber = function(number) {
            if (number === '.' && vm.currentOperand.includes('.')) return;
            vm.currentOperand = vm.currentOperand.toString() + number.toString();
        };

        vm.chooseOperation = function(operation) {
            if (vm.currentOperand === '') return;
            if (vm.previousOperand !== '') {
                vm.compute();
            }
            vm.operation = operation;
            vm.previousOperand = vm.currentOperand;
            vm.currentOperand = '';
        };

        vm.compute = function() {
            var computation;
            var prev = parseFloat(vm.previousOperand);
            var current = parseFloat(vm.currentOperand);
            
            if (isNaN(prev) || isNaN(current)) return;
            
            switch (vm.operation) {
                case '+':
                    computation = prev + current;
                    break;
                case '-':
                    computation = prev - current;
                    break;
                case '*':
                    computation = prev * current;
                    break;
                case '/':
                    if (current === 0) {
                        computation = 'Error';
                    } else {
                        computation = prev / current;
                    }
                    break;
                default:
                    return;
            }
            
            vm.currentOperand = computation.toString();
            vm.operation = undefined;
            vm.previousOperand = '';
        };
    });
