# Custom table #

## Goals ##

* To provide an html view template to configure table columns (as opposed to a configuration object)
* To enable fetching child rows and have them rendered into the same table at the appropriate point
* To allow for row functionality to be configured via callbacks to the controller
* To provide common functions such as clone, archive, delete that can be handled by services via the controller
* To provide pagination


## Instructions to load the demo app ##

* Clone repo
* npm install
* npm start
* browse to localhost:3000

## Example usage ##

```
<custom-table vm="vm" data="vm.data" get-children="vm.getChildren(id)" >
    <column>
        <header>Name</header>
        <template>
            <form class="form form-inline">
                <input class="form-control" type="text" ng-model="row.name" />
```
Callbacks on template via vm
```
                <button class="btn btn-sm" ng-click="vm.buttonClick(row.name)">Click me</button>
            </form>
        </template>
    </column>
    <column>
        <header>Age</header>
```
Different templates for parents / children
```
        <template parent>
            <strong>{{row.age}}</strong>
        </template>
        <template child>
            <span ng-bind="row.age"></span>
        </template>
```
```
    </column>
    <column>
        <header>Country</header>
        <template>{{row.country}}</template>
    </column>
</custom-table>

```