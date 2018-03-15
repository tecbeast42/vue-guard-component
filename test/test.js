import guard from '../src/js/vue-guard-component';
import { guardConfig } from '../src/js/vue-guard-component';

describe('Vue-guard-component', () => {

    it('should emit error on bad response', (done) => {
        guardConfig.authFunction = () => { return new Promise((resolve, reject) => reject('error')); };

        const vm = setup('resource="test" ref="guard" v-on:guard-error="setError"');
        const component = vm.$refs.guard;
        vm.$nextTick(() => {
            vm.$nextTick(() => {
                expect(vm.$el.textContent).to.equal('');
                expect(component.show).to.equal(false);
                expect(vm.error).to.equal(true);
                done();
            });
        });
    });

    it('should not show on ajax denied', (done) => {
        guardConfig.authFunction = () => { return new Promise((resolve) => resolve(false)); };

        const vm = setup('resource="test" ref="guard" v-on:guard-accepted="setAccepted" v-on:guard-denied="setDenied"');
        const component = vm.$refs.guard;
        vm.$nextTick(() => {
            vm.$nextTick(() => {
                expect(vm.$el.textContent).to.equal('');
                expect(component.show).to.equal(false);
                expect(vm.denied).to.equal(true);
                expect(vm.accepted).to.equal(false);
                done();
            });
        });
    });

    it('show on ajax accept', (done) => {
        guardConfig.authFunction = () => { return new Promise((resolve) => resolve(true)); };

        const vm = setup('resource="test" ref="guard" v-on:guard-accepted="setAccepted" v-on:guard-denied="setDenied"');
        const component = vm.$refs.guard;

        vm.$nextTick(() => {
            vm.$nextTick(() => {
                vm.$nextTick(() => {
                    expect(vm.$el.textContent).to.equal('test');
                    expect(component.show).to.equal(true);
                    expect(vm.denied).to.equal(false);
                    expect(vm.accepted).to.equal(true);
                    done();
                });
            });
        });
    });

    it('url should be set from prop when specified', () => {
        const vm = setup('resource="test" ref="guard" url="/url/prop"');
        const component = vm.$refs.guard;
        expect(component.ajaxUrl).to.equal('/url/prop');
    });

    it('url should be set from guardConfig if no prop', () => {
        guardConfig.path = "/url/guardConfig";
        const vm = setup('resource="test" ref="guard"');
        const component = vm.$refs.guard;
        expect(component.ajaxUrl).to.equal('/url/guardConfig');
    });
});

function setup(options) {
    return new Vue({
        template: '<guard ' + options + '>test</guard>',
        data () {
            return {
                accepted: false,
                denied: false,
                error: false,
            };
        },
        components: {
            'guard': guard
        },
        methods: {
            setAccepted () {
                this.accepted = true;
            },
            setDenied () {
                this.denied = true;
            },
            setError () {
                this.error = true;
            }
        }
    }).$mount();
}
