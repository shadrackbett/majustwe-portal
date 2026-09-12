from rest_framework import serializers
from users.models import User
from welfare.models import MemberProfile, Case, Contribution, Guardian, Dependent

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'zone')
        read_only_fields = ('role', 'zone')

class GuardianSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guardian
        fields = ('id', 'name', 'relationship', 'phone')

class DependentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dependent
        fields = ('id', 'name', 'relationship')

class MemberProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    guardians = GuardianSerializer(many=True, read_only=True)
    dependents = DependentSerializer(many=True, read_only=True)

    class Meta:
        model = MemberProfile
        fields = '__all__'
        read_only_fields = ('member_id', 'status', 'registration_fee_paid', 'emergency_kitty_paid', 'joined_at', 'rejection_reason')

class CaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Case
        fields = '__all__'

class ContributionSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.user.get_full_name', read_only=True)
    case_title = serializers.CharField(source='welfare_case.title', read_only=True)

    class Meta:
        model = Contribution
        fields = '__all__'
        read_only_fields = ('date_paid',)
